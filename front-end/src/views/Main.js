import React, { useEffect, useState } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from '../ui-components/NavBar';
import { Box, Container, Grid, Typography } from '@mui/material';
import Footer from '../ui-components/Footer';
import Catgeory from '../ui-components/Catgeory';
import ProductCard from '../ui-components/ProductCard';
import { getAllProducts } from '../utils/products';

const theme = createTheme();

const Main = () => {
    const [products, setProducts] = useState([]);

    const fetchDataProducts = async () => {
        try {
            const data = await getAllProducts();
            setProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchDataProducts();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar />
            <main>
                {/* Hero unit */}
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        pt: 8,
                        pb: 6
                    }}
                >
                    <Container maxWidth="xl">
                        <Typography component="h1" variant="h2" align="left" color="text.primary">
                            <Catgeory
                                getAllProducts={fetchDataProducts}
                                setProducts={setProducts}
                            />
                        </Typography>
                        <Container maxWidth="xl">
                            <Grid container spacing={3}>
                                {React.Children.toArray(
                                    products.map((item) => {
                                        return (
                                            <Grid item alignContent="center">
                                                <ProductCard product={item} />
                                            </Grid>
                                        );
                                    })
                                )}
                            </Grid>
                        </Container>
                    </Container>
                </Box>
            </main>
            <Footer />
        </ThemeProvider>
    );
};

export default Main;
