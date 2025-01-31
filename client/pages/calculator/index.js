import { useState, useEffect } from "react";
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from 'axios';
import Link from "next/link";

export default function CalculatorPage(props) {
  const [items, setItems] = useState(props.items || []);
  const [services, setServices] = useState(props.services || []);
  const [materials, setMaterials] = useState(props.materials || []);
  const [cases, setCases] = useState(props.cases || []);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const [total, setTotal] = useState(0);
  
  useEffect(() => {
    if (selectedItem && selectedService && selectedMaterial && selectedCase) {
      const totalPrice = 
        selectedItem.price + 
        selectedService.price + 
        selectedMaterial.price + 
        selectedCase.price;
      setTotal(totalPrice);
    } else {
      setTotal(0);
    }
  }, [selectedItem, selectedService, selectedMaterial, selectedCase]);

  const handleSelect = (type, item) => {
    if (type === "item") setSelectedItem(item);
    if (type === "service") setSelectedService(item);
    if (type === "material") setSelectedMaterial(item);
    if (type === "case") setSelectedCase(item);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh" sx={{ position: "relative", paddingBottom: 100 }}>
      <Box display="flex" flex={1} sx={{ overflow: "auto", paddingTop: 10 }}>
        {/* Items Table */}
        <TableSection 
          title="Маталар" 
          data={items} 
          selected={selectedItem} 
          onSelect={(item) => handleSelect("item", item)}
          link="/items"
        />

        {/* Services Table */}
        <TableSection 
          title="Қызметтер" 
          data={services} 
          selected={selectedService} 
          onSelect={(item) => handleSelect("service", item)}
          link="/services"
        />

        {/* Materials Table */}
        <TableSection 
          title="Шикізат" 
          data={materials} 
          selected={selectedMaterial} 
          onSelect={(item) => handleSelect("material", item)}
          link="/materials"
        />

        {/* Cases Table */}
        <TableSection 
          title="Қаптар" 
          data={cases} 
          selected={selectedCase} 
          onSelect={(item) => handleSelect("case", item)}
          link="/cases"
        />
      </Box>

      {/* Total Price Display at the Bottom */}
      <Box 
        sx={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          width: "100%", 
          backgroundColor: "white", 
          padding: 2, 
          boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", 
          textAlign: "center"
        }}
      >
        <Typography variant="h5" gutterBottom>
          Жиынтық баға: {total}₸
        </Typography>
      </Box>
    </Box>
  );
};

// Reusable Table Component
const TableSection = ({ title, data, selected, onSelect, link }) => (
  <Box flex={3} bgcolor="white" py={4} display="flex" flexDirection="column" alignItems="center">
    <Link href={link}>
      <Typography variant="h4" gutterBottom sx={{ cursor: 'pointer' }}>
        {title}
      </Typography>
    </Link>
    <TableContainer component={Paper} sx={{ maxWidth: "90%", height: "70vh" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Атауы</strong></TableCell>
            <TableCell><strong>Бағасы (₸)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <TableRow 
                key={index} 
                onClick={() => onSelect(item)} 
                sx={{ cursor: 'pointer', backgroundColor: selected?.name === item.name ? "#f0f0f0" : "white" }}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}₸</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">Элементтер жоқ</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Box>
);

export const getStaticProps = async () => {
  try {
    const items = await axios.get(`${process.env.server}/item`);
    const services = await axios.get(`${process.env.server}/service`);
    const materials = await axios.get(`${process.env.server}/material`);
    const cases = await axios.get(`${process.env.server}/case`);

    return {
      props: {
        items: items.data || [],
        services: services.data || [],
        materials: materials.data || [],
        cases: cases.data || [],
      },
      revalidate: 10, // Re-fetch data every 10 seconds
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
