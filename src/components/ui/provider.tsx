'use client'

import { ChakraProvider, createSystem, defaultConfig, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'


const system = createSystem({
  ...defaultConfig,
  preflight: false, // 🔥 DESATIVA RESET
})

export function Provider(props: ColorModeProviderProps) {
  return (
    <ColorModeProvider {...props}>
      <ChakraProvider value={system}>
        {props.children}
      </ChakraProvider>
    </ColorModeProvider>
  )
}
