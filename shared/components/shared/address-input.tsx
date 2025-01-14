'use client';
import React from 'react';
import { AddressSuggestions } from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';

interface Props {
	onChange?: (value?: string) => void;
}
export const AdressInput: React.FC<Props> = ({ onChange }) => {
	return (
		<AddressSuggestions
			token="d81f716b3aae9bf8ee53a9a98293e340eaf68d50"
			onChange={(data) => onChange?.(data?.value)}
		/>
	);
};
