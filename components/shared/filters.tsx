import React from 'react';
import { Title } from '.';

interface Props {
	className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
	return (
		<div className={className}>
			<Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
			<div className='flex flex-col gap-4'>
				<ch
			</div>
		</div>
	);
};
