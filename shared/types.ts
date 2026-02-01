export interface DateIdea {
  id: string;
  idea: string;
  lastShown: string | null;
  lastCompleted: string | null;
}

export interface DateIdeaData {
  ideas: DateIdea[];
}

export interface PickedIdeas {
  ideas: DateIdea[];
}
