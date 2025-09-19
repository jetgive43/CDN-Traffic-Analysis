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
      <LogTable />
    </Container>
  );
}
