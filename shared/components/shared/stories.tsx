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
				className={cn('flex items-center justify-between gap-1 my-10')}>
				{stories.length === 0 &&
					[...Array(6)].map((_, index) => (
						<div
							key={index}
							className="w-[120px] h-[120px] bg-gray-200 rounded-full animate-pulse"></div>
					))}
				{stories.map((story) => (
					<div
						key={story.id}
						className="flex justify-center p-2 bg-secondary rounded-full h-[150px] w-[150px]">
						<img
							key={story.id}
							onClick={() => onClickStory(story)}
							className="rounded-full cursor-pointer object-cover"
							height={150}
							width={150}
							src={story.previewImageUrl}
							alt="stories"
						/>
					</div>
				))}
				{open && (
					<div className="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30">
						<div className="relative" style={{ width: 520 }}>
							<button
								className="absolute -right-10 -top-5 z-30"
								onClick={() => setOpen(false)}>
								<X className="absolute top-0 right-0 w-8 h-8 text-white/50" />
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
