import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

const PageNotFound = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            textAlign="center"
        >
            <Typography 
                variant="h1" 
                component="h1"
                sx={{
                    fontWeight: 'bold',
                    mb: 2
                }}
            >
                404 - Page Not Found
            </Typography>
            
            <Button 
                component={Link} 
                to="/home"
                variant="contained"
                sx={{
                    mt: 2,
                    px: 4,
                    py: 1
                }}
            >
                Home
            </Button>
        </Box>
    );
}

export default PageNotFound;