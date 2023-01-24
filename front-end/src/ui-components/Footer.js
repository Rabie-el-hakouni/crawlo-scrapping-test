import React from 'react'
import { Box , Typography} from '@mui/material'
const Footer = () => {
  return (
    <>
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
                component="p"
                >
                created By Rabie El Hakouni
            </Typography>
        </Box>
    </>
  )
}

export default Footer