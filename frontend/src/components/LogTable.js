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
        `${API_BASE_URL}/getlogs/hosts/stats-with-size`
      );
      if (response.data.success) {
        setHostStats(response.data.hostStats);
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
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTransferRate = (rate) => {
    return parseFloat(rate).toFixed(4) + " MB/s";
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
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
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                        <TableCell align="right">
                          <strong>Requests</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Total Size</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>Transfer Rate</strong>
                        </TableCell>
                        <TableCell align="right">
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
                              <TableCell align="right">
                                <Chip
                                  label={host.count}
                                  color="primary"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {host.totalSize}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  <Speed fontSize="small" />
                                  <Typography variant="body2">
                                    {formatTransferRate(
                                      host.transferRateMBPerSecond
                                    )}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="body2">
                                  {parseFloat(
                                    host.timeDifferenceMinutes
                                  ).toFixed(1)}{" "}
                                  min
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
