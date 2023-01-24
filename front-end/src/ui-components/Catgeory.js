import React, { useEffect, useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { getAllCategories, getaProductsByCategoryId } from '../utils/products';

const Catgeory = ({ setProducts, getAllProducts }) => {
    const [categories, setCategories] = useState([]);
    const fetchData = async () => {
        try {
            const data = await getAllCategories();
            setCategories(data);
            console.log(data);
            // setSelectedCategory('');
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const onChange = async (categoryId) => {
        try {
            const data = await getaProductsByCategoryId(categoryId.target.value);
            setProducts(data);
            console.log(data);
            // setSelectedCategory('');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '100px'
            }}
        >
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Catgoery"
                    // value={categories[0]?._id}
                    onChange={(value) => onChange(value)}
                >
                    {React.Children.toArray(
                        categories.map((category) => {
                            return <MenuItem value={category._id}>{category.name}</MenuItem>;
                        })
                    )}
                </Select>
            </FormControl>
            <Button sx={{ ml: 4 }} variant="contained" onClick={() => getAllProducts()}>
                All
            </Button>
        </div>
    );
};
export default Catgeory;
