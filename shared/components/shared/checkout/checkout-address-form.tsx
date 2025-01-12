import { Input, Textarea } from '../../ui';
import { WhiteBlock } from '../white-block';

interface Props {
	className?: string;
}
export const CheckoutAdressForm: React.FC<Props> = () => {
	return (
		<WhiteBlock title="3. Адрес доставки">
			<div className="flex flex-col gap-5">
				<Input
					name="firstName"
					className="text-base"
					placeholder="Адрес доставки"></Input>
				<Textarea
					className="text-base"
					rows={5}
					placeholder="Комментарий к заказу"
				/>
			</div>
		</WhiteBlock>
	);
};
