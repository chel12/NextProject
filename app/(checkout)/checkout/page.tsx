import {
	CheckoutItem,
	CheckoutItemDetails,
	Container,
	Title,
	WhiteBlock,
} from '@/shared/components/shared';
import { Button, Input, Textarea } from '@/shared/components/ui';
import { ArrowRight, Package, Percent, Truck } from 'lucide-react';

export default function CheckoutPage() {
	return (
		<Container className="mt-8">
			<Title
				className=" font-extrabold mb-8 text-[36px]"
				text="Оформление заказа"
			/>
			<div className="flex gap-10">
				{/* левый блок*/}
				<div className="flex flex-col gap-10 flex-1 mb-20">
					<WhiteBlock title="1. Корзина">
						<div className="flex flex-col gap-5">
							<CheckoutItem
								id={1}
								imageUrl={
									'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
								}
								name={'Call Of Duty'}
								price={500}
								quantity={2}
								details={'Zalupka'}
							/>
							<CheckoutItem
								id={1}
								imageUrl={
									'https://gaming-cdn.com/images/products/1620/orig/call-of-duty-4-modern-warfare-pc-mac-game-steam-cover.jpg?v=1701179820'
								}
								name={'Call Of Duty'}
								price={500}
								quantity={2}
								details={'Zalupka'}
							/>
						</div>
					</WhiteBlock>
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
							<Input
								name="phone"
								className="text-base"
								placeholder="Телефон"></Input>
						</div>
					</WhiteBlock>
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
				</div>
				{/* правый блок*/}
				<div className="w-[450px]">
					<WhiteBlock className="p-6 sticky top-4">
						<div className="flex flex-col gap-1">
							<span className="text-xl">Итого: </span>
							<span className="text-[34px] font-extrabold">
								199 Р.
							</span>
						</div>
						<CheckoutItemDetails
							title={
								<div className="flex items-center">
									<Package size={18} className="mr-2" />
									Стоимость товаров
								</div>
							}
							value="199"
						/>
						<CheckoutItemDetails
							title={
								<div className="flex items-center">
									<Percent size={18} className="mr-2" />
									Налоги
								</div>
							}
							value="1"
						/>
						<CheckoutItemDetails
							title={
								<div className="flex items-center">
									<Truck size={18} className="mr-2" />
									Доставка
								</div>
							}
							value="10"
						/>
						<Button
							type="submit"
							className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
							Перейти к оплате
							<ArrowRight className="w-5 ml-2" />
						</Button>
					</WhiteBlock>
				</div>
			</div>
		</Container>
	);
}
