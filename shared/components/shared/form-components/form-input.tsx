import { Input } from '../../ui';
import { ClearButton } from '../clear-button';
import { ErrorText } from '../error-text';
import { RequiredSymbol } from '../required-symbol';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label?: string;
	required?: boolean;
	className?: string;
}

export const FormInput: React.FC<Props> = ({
	
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
				<ClearButton />
			</div>
			<ErrorText text="алло бля" className="mt-2" />
		</div>
	);
};
