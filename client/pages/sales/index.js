import { useState, useEffect } from "react";
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from "@mui/material";
import axios from 'axios';
import { format } from 'date-fns';

export default function SalesList() {
  const [sales, setSales] = useState([]);
  const [sum, setSum] = useState(0);
  const [startDate, setStartDate] = useState(""); // Start date for filter
  const [endDate, setEndDate] = useState(""); // End date for filter

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(`${process.env.server}/sale`);
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };

    fetchSales();
  }, []);

  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24-hour format
    });
    return formattedDate;
  };

  const calculateTotal = (all) => {
    let total = 0;
    all.forEach(element => {
      if (element) {
        total += element;
      }
    });
    return total;
  };

  // Filter sales by date range
  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && saleDate < start) return false;
    if (end && saleDate > end) return false;
    return true;
  });

  useEffect(() => {
    // Update total sum based on filtered sales
    const newSum = filteredSales.reduce((total, sale) => {
      return total + calculateTotal([
        sale.item?.price, 
        sale.service?.price, 
        sale.case?.price, 
        sale.material?.price
      ]);
    }, 0);
    setSum(newSum);
  }, [filteredSales]);

  return (
    <Box display="flex" height="100vh" justifyContent="center" alignItems="center" sx={{ position: "absolute", width: "100%", top: 0, height: "100vh" }}>
      <Box flex={8} bgcolor="white" display="flex" flexDirection="column" alignItems="center" p={4} height="100vh">
        <Typography variant="h4" gutterBottom>
          Сатылымдар тізімі
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: "90%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Маталар</strong></TableCell>
                <TableCell><strong>Қызметтер</strong></TableCell>
                <TableCell><strong>Шикізат</strong></TableCell>
                <TableCell><strong>Қаптар</strong></TableCell>
                <TableCell><strong>Сатылған күн</strong></TableCell>
                <TableCell><strong>Баға</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{sale.item?.name}({sale.item?.price}₸)</TableCell>
                    <TableCell>{sale.service?.name}({sale.service?.price}₸)</TableCell>
                    <TableCell>{sale.material?.name}({sale.material?.price}₸)</TableCell>
                    <TableCell>{sale.case?.name}({sale.case?.price}₸)</TableCell>
                    <TableCell>{formatDate(sale.createdAt)}</TableCell>
                    <TableCell><strong>{calculateTotal([sale.item?.price, sale.service?.price, sale.case?.price, sale.material?.price])}₸</strong></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Сатылымдар жоқ
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          position: "absolute",
          display: 'flex',
          justifyContent: "space-between",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          padding: 2,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Сатылым суммасы: {sum}₸
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
          <TextField
            label="Басталуы"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Аяқталуы"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button variant="contained" onClick={() => { setStartDate(""); setEndDate(""); }}>Өшіру</Button>
        </Box>
      </Box>
    </Box>
  );
}

export const getStaticProps = async () => {
  try {
    const response = await axios.get(`${process.env.server}/sale`);
    return {
      props: { sales: response.data || [] },
      revalidate: 10, // Re-fetch data every 10 seconds
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
