import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect } from 'react';

const ProductCard = ({ product }) => {
    useEffect(() => {
        console.log(product);
    }, []);

    return (
        <Card sx={{ maxWidth: 400, maxHeight: 600 }}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'center'
                }}
            >
                <img src={product.img_url} style={{ width: '60%' }} />
            </div>
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name.slice(0, 150)} ...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {/* {product.specifications} */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.brand}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.availability}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {/* {productCategory} */}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.price}
                </Typography>
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
