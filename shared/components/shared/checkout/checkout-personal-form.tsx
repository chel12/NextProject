import { Input } from '../../ui';
import { FormInput } from '../form-components';
import { WhiteBlock } from '../white-block';

interface Props {
	className?: string;
}
export const CheckoutPersonalForm: React.FC<Props> = () => {
	return (
		<WhiteBlock title="2. Персональные данные">
			<div className="grid grid-cols-2 gap-5">
				<Input
					name="firstName"
					className="text-base"
					placeholder="Имя"></Input>
				<Input
					name="lastName"
					className="text-base"
					placeholder="Фамилия"></Input>
				<Input
					name="email"
					className="text-base"
					placeholder="E-Mail"></Input>
				<FormInput
					name="phone"
					className="text-base"
					placeholder="Телефон"></FormInput>
			</div>
		</WhiteBlock>
	);
};
