import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    Grid,
    Stack,
    Typography
} from '@mui/material';

import { Box } from '@mui/system';
import React, { useEffect } from 'react';
// import { deliveryToHours } from '../utils/utils';

const ProductCard = ({ product }) => {
    useEffect(() => {
        console.log(product.specifications);
    }, []);

    return (
        <Card sx={{ maxWidth: 400, maxHeight: 700 }}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <img src={product.img_url} style={{ width: '40%' }} />
            </div>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name.slice(0, 100)} ...
                </Typography>
                <Divider orientation="horizontal">Informations</Divider>
                <Box sx={{ m: 2 }}>
                    <Stack direction="row" spacing={3}>
                        <Grid continer="true">
                            <Chip
                                color="info"
                                size="small"
                                textAlign="center"
                                label={`Ctagory: ${product.category.name}`}
                            />
                            <Chip
                                variant="outlined"
                                size="small"
                                textAlign="center"
                                label={`Brand: ${product.brand}`}
                            />

                            <Chip
                                color="warning"
                                size="small"
                                textAlign="center"
                                label="Delivery: 24H"
                            />

                            <Chip
                                color="success"
                                size="small"
                                textAlign="center"
                                label={`Availability: ${product.availability}`}
                            />
                            <Chip
                                color="error"
                                size="small"
                                textAlign="center"
                                label={`Price: ${product.price}`}
                            />
                        </Grid>
                    </Stack>
                </Box>
                <Box>
                    <Accordion>
                        <AccordionSummary color="primary">Specifications</AccordionSummary>
                        <AccordionDetails>
                            {product?.specifications?.map((spec) => {
                                return (
                                    <div>
                                        <span>
                                            <b>{spec.key} :</b>
                                        </span>
                                        <span>{spec.value} </span>
                                    </div>
                                );
                            })}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </CardContent>
            <CardActions>
                <Button variant="contained" href={product.url} fullWidth>
                    View
                </Button>
            </CardActions>
        </Card>
    );
};

export default ProductCard;
