import { Input } from '../../ui';
import { RequiredSymbol } from '../required-symbol';

interface Props {
	name: string;
	label?: string;
	required?: boolean;
	className?: string;
}

export const FormInput: React.FC<Props> = ({
	name,
	className,
	label,
	required,
	...props
}) => {
	return (
		<div className={className}>
			{label && (
				<p className="font-medium mb-2">
					{label} {required && <RequiredSymbol />}
				</p>
			)}
			<div className="relative">
				<Input className="h-12 text-md" {...props} />
			</div>
			{}
		</div>
	);
};
