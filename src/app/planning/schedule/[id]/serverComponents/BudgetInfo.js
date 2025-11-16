import { MakeBudget, CheckBudget } from '../components/Budget';

export default async function BudgetInfo({ id }) {
	const schedule = await prisma.schedule.findUnique({
		where: { id },
		include: {
			budgets: true
		}
	});
	const budget = schedule.budgets;

	return (
		<>
			{budget.length === 0 ? (
				<MakeBudget scheduleId={id} />
			) : (
				<CheckBudget budget={budget} />
			)}
		</>
	);
}
