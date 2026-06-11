'use client'

import React from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogBackdrop,
} from '@chakra-ui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  return (
    <DialogRoot 
      open={isOpen} 
      onOpenChange={onClose} 
      size={size}
    >
      <DialogBackdrop />
      <DialogContent borderRadius="2xl" border="none" shadow="2xl">
        <DialogHeader borderBottom="1px solid" borderColor="gray.50" py={6}>
          <DialogTitle fontSize="xl" fontWeight="bold" color="brand-dark-blue">
            {title}
          </DialogTitle>
          <DialogCloseTrigger top={4} right={4} />
        </DialogHeader>
        
        <DialogBody py={8}>
          {children}
        </DialogBody>

        {footer && (
          <DialogFooter borderTop="1px solid" borderColor="gray.50" py={6}>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
