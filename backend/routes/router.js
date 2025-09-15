const express = require('express')
const router = express.Router()
const path = require('path')
const { getLogLines, parseLogFile, extractField, filterLogs, getUniqueValues, groupByHostName, groupByHostNameWithSize, getHostNameStats, getHostNameStatsWithSize, getLogsByHostName, getHostSummary, getAllHostsSummary } = require('../utils/logParser')

// Get all log lines as string array
router.get('/getlogs', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const logLines = getLogLines(logFilePath)
    console.log(typeof logLines);
     
    res.json({
      success: true,
      totalLines: logLines.length,
      lines: logLines
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get parsed log entries
router.get('/getlogs/parsed', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const parsedLogs = parseLogFile(logFilePath)
    
    res.json({
      success: true,
      totalEntries: parsedLogs.length,
      entries: parsedLogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get specific field as array
router.get('/getlogs/field/:fieldName', async (req, res) => {
  try {
    const { fieldName } = req.params
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const fieldValues = extractField(logFilePath, fieldName)
    
    res.json({
      success: true,
      field: fieldName,
      totalValues: fieldValues.length,
      values: fieldValues
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get unique values from a field
router.get('/getlogs/unique/:fieldName', async (req, res) => {
  try {
    const { fieldName } = req.params
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const uniqueValues = getUniqueValues(logFilePath, fieldName)
    
    res.json({
      success: true,
      field: fieldName,
      uniqueCount: uniqueValues.length,
      uniqueValues: uniqueValues
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Filter logs by status code
router.get('/getlogs/status/:statusCode', async (req, res) => {
  try {
    const { statusCode } = req.params
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    
    const filteredLogs = filterLogs(logFilePath, line => {
      const parts = line.split('**')
      return parts[4] === statusCode
    })
    
    res.json({
      success: true,
      statusCode: statusCode,
      totalMatches: filteredLogs.length,
      logs: filteredLogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get host name statistics (grouped by host name with counts)
router.get('/getlogs/hosts/stats', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostStats = getHostNameStats(logFilePath)
    
    res.json({
      success: true,
      totalHosts: hostStats.length,
      hostStats: hostStats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get host name counts (simple object with host:count)
router.get('/getlogs/hosts/counts', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostCounts = groupByHostName(logFilePath)
    
    res.json({
      success: true,
      totalHosts: Object.keys(hostCounts).length,
      hostCounts: hostCounts
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get host name sizes (sum up size field for each host)
router.get('/getlogs/hosts/sizes', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostSizes = groupByHostNameWithSize(logFilePath)
    const hostStats = getHostNameStats(logFilePath)
    
    // Convert to MB for easier reading
    const hostSizesMB = {};
    Object.entries(hostSizes).forEach(([host, size]) => {
      hostSizesMB[host] = {
        totalSizeBytes: size,
        totalSizeMB: (size / (1024 * 1024)).toFixed(2),
        hostStats: hostStats
      };
    });
    
    res.json({
      success: true,
      totalHosts: Object.keys(hostSizes).length,
      hostSizes: hostSizesMB
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get host statistics with size information (sorted by total size)
router.get('/getlogs/hosts/stats-with-size', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostStatsWithSize = getHostNameStatsWithSize(logFilePath)
    
    res.json({
      success: true,
      totalHosts: hostStatsWithSize.length,
      hostStats: hostStatsWithSize
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get logs for a specific host name
router.get('/getlogs/hosts/:hostName', async (req, res) => {
  try {
    const { hostName } = req.params
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostLogs = getLogsByHostName(logFilePath, hostName)
    
    res.json({
      success: true,
      hostName: hostName,
      totalLogs: hostLogs.length,
      logs: hostLogs
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get comprehensive summary for a specific DNS/host name (sums up all lines for that DNS)
router.get('/getlogs/hosts/:hostName/summary', async (req, res) => {
  try {
    const { hostName } = req.params
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const hostSummary = getHostSummary(logFilePath, hostName)
    
    res.json({
      success: true,
      summary: hostSummary
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get summary for all hosts (sums up all lines for each DNS)
router.get('/getlogs/hosts/all/summary', async (req, res) => {
  try {
    const logFilePath = path.join(__dirname, '..', 'stream3510570066.log')
    const allHostsSummary = getAllHostsSummary(logFilePath)
    
    res.json({
      success: true,
      totalHosts: allHostsSummary.length,
      hostsSummary: allHostsSummary
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})


module.exports = router