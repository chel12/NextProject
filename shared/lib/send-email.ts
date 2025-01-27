import { Resend } from 'resend';
import { PayOrderTemplate } from '../components/shared/email-templates/pay-order';
import { ClientPageRoot } from 'next/dist/client/components/client-page';

export const sendEmail = async (to: string, subject: string, template: React.ReactNode) => {
	const resend = new Resend(process.env.RESEND_API_KEY);

	const { data, error } = await resend.emails.send({
		from: 'Acme <onboarding@resend.dev>',
		to,
		subject,
		react: template,
	});

	if (error) {
		throw error;
		console.error(error);
	}

	return data;
};
