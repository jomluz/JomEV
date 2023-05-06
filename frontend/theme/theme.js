// theme.js

// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const colorScheme = 'orange';

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

const IconButton = {
  // style object for base or default style
  baseStyle: {
    bgColor: 'orange.300'
  },
  // default values for 'size', 'variant' and 'colorScheme'
  defaultProps: {
    colorScheme
  },
}

const Button = {
  defaultProps: {
    size: 'lg', // default is md
    fontWeight: 'bold',
    colorScheme, // default is orange
  },
};

const components = {
  IconButton,
  Button
}


// 3. extend the theme
const theme = extendTheme({ config, components })

export default theme