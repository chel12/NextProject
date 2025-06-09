import React from 'react';

interface Props {
	className?: string;
}

export const OrderList: React.FC<Props> = ({ className }) => {
	return <div className={className}> STACK</div>;
};
