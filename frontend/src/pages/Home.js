import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { Dashboard, Analytics, Storage } from "@mui/icons-material";
import LogTable from "../components/LogTable";

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      {/* <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Dashboard /> Log Analytics Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3, color: "#ffffff" }} >
                    Monitor and analyze your server logs with real-time statistics and insights
                </Typography>
            </Box> */}

      {/* Feature Cards */}
      {/* <Grid container spacing={5} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Analytics sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Real-time Analytics
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Monitor host statistics, transfer rates, and request patterns in real-time
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Storage sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Data Transfer Monitoring
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track data transfer rates and bandwidth usage across different hosts
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Dashboard sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                            <Typography variant="h6" gutterBottom>
                                Interactive Tables
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Explore detailed log entries with filtering and sorting capabilities
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid> */}

      {/* Log Table Component */}
      <LogTable />
    </Container>
  );
}
