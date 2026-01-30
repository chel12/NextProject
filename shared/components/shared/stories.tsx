'use client';
import { Api } from '@/shared/services/api-client';
import { IStory } from '@/shared/services/stories';
import React from 'react';
import { Container } from '.';
import ReactStories from 'react-insta-stories';
import { cn } from '@/shared/lib/utils';
import { X } from 'lucide-react';

export const Stories: React.FC = () => {
	//все истории
	const [stories, setStories] = React.useState<IStory[]>([]);
	//открыть историю
	const [open, setOpen] = React.useState(false);
	//какая именно история открыта
	const [selectedStory, setSelectedStory] = React.useState<IStory>();

	//запрос useEffectom
	React.useEffect(() => {
		async function fetchStories() {
			const data = await Api.stories.getAll();
			setStories(data);
		}
		fetchStories();
	}, []);

	const onClickStory = (story: IStory) => {
		setSelectedStory(story);
		if (story.items.length > 0) setOpen(true);
	};

	return (
		<>
			<Container
				className={cn('flex items-center justify-between gap-2 sm:gap-1 my-5 sm:my-10 overflow-x-auto')}>
				{stories.length === 0 &&
					[...Array(6)].map((_, index) => (
						<div
							key={index}
							className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
					))}
				{stories.map((story) => (
					<div
						key={story.id}
						className="flex justify-center p-1 sm:p-2 bg-secondary rounded-full h-[80px] w-[80px] sm:h-[150px] sm:w-[150px] flex-shrink-0">
						<img
							key={story.id}
							onClick={() => onClickStory(story)}
							className="rounded-full cursor-pointer object-cover w-full h-full"
							height={150}
							width={150}
							src={story.previewImageUrl}
							alt="stories"
						/>
					</div>
				))}
				{open && (
					<div className="fixed inset-0 w-full h-full bg-black/80 flex items-center justify-center z-50 p-4">
						<div className="relative w-full max-w-[520px]">
							<button
								className="absolute -right-2 -top-2 z-30 bg-white rounded-full p-1"
								onClick={() => setOpen(false)}>
								<X className="w-6 h-6 text-black" />
							</button>
							<ReactStories
								onAllStoriesEnd={() => setOpen(false)}
								stories={
									selectedStory?.items.map((item) => ({
										url: item.sourceUrl,
									})) || []
								}
								defaultInterval={3000}
								width={520}
								height={800}
							/>
						</div>
					</div>
				)}
			</Container>
		</>
	);
};
