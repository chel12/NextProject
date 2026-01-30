import { FormInput } from '../form';
import { WhiteBlock } from '../white-block';

interface Props {
	className?: string;
}
export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
	return (
		<WhiteBlock title="2. Персональные данные" className={className}>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
				<FormInput
					name="firstName"
					className="text-base"
					placeholder="Имя"></FormInput>
				<FormInput
					name="lastName"
					className="text-base"
					placeholder="Фамилия"></FormInput>
				<FormInput
					name="email"
					className="text-base"
					placeholder="E-Mail"></FormInput>
				<FormInput
					name="phone"
					className="text-base"
					placeholder="Телефон"></FormInput>
			</div>
		</WhiteBlock>
	);
};
