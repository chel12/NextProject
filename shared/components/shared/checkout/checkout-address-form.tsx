import { Controller, useFormContext } from 'react-hook-form';
import { AdressInput } from '../address-input';
import { FormTextarea } from '../form';
import { WhiteBlock } from '../white-block';
import { ErrorText } from '../error-text';

interface Props {
	className?: string;
}
export const CheckoutAdressForm: React.FC<Props> = () => {
	const { control } = useFormContext();
	return (
		<WhiteBlock title="3. Адрес доставки">
			<div className="flex flex-col gap-5">
				{/* <Input
					name="firstName"
					className="text-base"
					placeholder="Адрес доставки"></Input> */}
				{/* контроллер чтобы связать данные из АдресИнпута с RHF */}
				<Controller
					control={control}
					name="address"
					render={({ field, fieldState }) => (
						<>
							<AdressInput onChange={field.onChange} />
							{fieldState.error?.message && (
								<ErrorText text={fieldState.error.message} />
							)}
						</>
					)}
				/>

				<FormTextarea
					name="comment"
					className="text-base"
					rows={5}
					placeholder="Комментарий к заказу"
				/>
			</div>
		</WhiteBlock>
	);
};
