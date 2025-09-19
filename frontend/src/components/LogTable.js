import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Refresh, Storage, Speed, Timeline } from "@mui/icons-material";
import axios from "axios";

const LogTable = () => {
  const [hostStats, setHostStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://92.246.87.165:4000";

  const fetchLogData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/getlogs/category4/process-content`
      );

      if (response.data.success && response.data.processedLogContent) {
        let allHostStats = [];

        response.data.processedLogContent.forEach((item) => {
          if (item.hostStatistics && item.hostStatistics.length > 0) {
            allHostStats.push(...item.hostStatistics);
          }
        });

        allHostStats = allHostStats
          .filter((stat) => stat !== null)
          .filter(
            (stat, index, self) =>
              index === self.findIndex((s) => s.host === stat.host) // keep only first occurrence of each host
          )
          .sort((a, b) => (b.totalSize || 0) - (a.totalSize || 0));

        setHostStats(allHostStats);
      }
    } catch (err) {
      setError(
        "Failed to fetch log data. Make sure the backend server is running."
      );
      console.error("Error fetching log data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogData();
    const interval = setInterval(fetchLogData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 GB";
    const k = 1024;
    const gbytes = bytes / Math.pow(k, 3); // Convert to GB (1024^3)
    return parseFloat(gbytes.toFixed(3)) + " GB";
  };

  const formatMB = (bytes) => {
    if (bytes === 0) return "0 MB";
    const k = 1024;
    const mbytes = bytes / Math.pow(k, 2); // Convert to MB (1024^2)
    return parseFloat(mbytes.toFixed(2)) + " MB";
  };

  const formatKB = (bytes) => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const kbytes = bytes / k; // Convert to KB (1024^1)
    return parseFloat(kbytes.toFixed(1)) + " KB";
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#000000",
        }}
      >
        <Storage /> Log Analytics Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" spacing={3}>
        {/* Host Statistics Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#000000",
                  }}
                >
                  <Timeline /> Host Statistics
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={fetchLogData}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Host Name</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Requests</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Total Size</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Speed (Mbps)</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>Time Span</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {hostStats.map(
                        (host, index) =>
                          host !== null && (
                            <TableRow key={index} hover>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {host.host}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={host.count}
                                  color="primary"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {host.totalSize}(
                                  {formatBytes(host.totalSize) +
                                    "/" +
                                    formatMB(host.totalSize) +
                                    "/" +
                                    formatKB(host.totalSize)}
                                  )
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {host.transferRateMbps}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="body2">
                                  {host.timeDifferenceMinutes}(Minutes)
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Typography>
    </Box>
  );
};

export default LogTable;
