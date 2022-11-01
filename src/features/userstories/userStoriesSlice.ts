import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store';

export enum ImageUrls {
	toDo = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_01_ToDo.jpg',
	readyForDevelopment = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_02_ReadyForDevelopment.jpg',
	inDevelopment = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_03_InDevelopment.jpg',
	readyForTesting = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_04_ReadyForTesting.png',
	inQA = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_05_InQA.jpg',
	inPOReview = 'https://blog.geekitude.com/wp-content/uploads/2022/10/TicketStage_06_InPOReview.png',
	done = 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_06_Done.jpg'
};

export enum StageNames {
	toDo = 'To Do',
	readyForDevelopment = 'Ready for Development',
	inDevelopment = 'In Development',
	readyForTesting = 'Ready for Testing',
	inQA = 'In QA',
	inPOReview = 'In Product Owner Review',
	done =  'Done'
};
 
export const stageOptions = [
{ label: StageNames.toDo, value: 'toDo', imageUrl: ImageUrls.toDo },
{ label: StageNames.readyForDevelopment, value: 'readyForDevelopment', imageUrl: ImageUrls.readyForDevelopment },	
{ label: StageNames.inDevelopment, value: 'inDevelopment', imageUrl: ImageUrls.inDevelopment },	
{ label: StageNames.readyForTesting, value: 'readyForTesting', imageUrl: ImageUrls.readyForTesting},
{ label: StageNames.inQA, value: 'inQA', imageUrl: ImageUrls.inQA },
{ label: StageNames.inPOReview, value: 'inPOReview', imageUrls: ImageUrls.inPOReview },
{ label: StageNames.done, value: 'done', imageUrl: ImageUrls.done },
];

export type Stage = 'toDo' | 'readyForDevelopment' | 'inDevelopment' | 'readyForTesting' | 'inQA' | 'done';

export interface UserStory {
	id: string;
	title: string;
	stage: Stage,
	imageUrl: string;  
}

export interface UserStoryStage {
	id: string;
	stage: Stage
}

export interface UserStoriesState {
  entities: UserStory[],
  loading: boolean,
  error: string | undefined
}

const initialState: UserStoriesState = {
  entities: [],
  loading: false,
  error: undefined
}

/*
export const getUserStories = createAsyncThunk(
  'userstories/getUserStories',
  async (thunkAPI) => {
    const res = await fetch('api/userstories').then(
	// const res = await fetch('https://api.geekitude.com/api/userStories').then(
    (data) => data.json()
  )
  return res
})
*/


export const getUserStories = createAsyncThunk(
  'userstories/getUserStories',
  async (_, { rejectWithValue }) => {
	try { 
		// const response = await fetch('api/userstories'); 
		const response = await fetch('https://api.geekitude.com/api/userStories'); 
		if (response.status === 200) {
			console.log(`'userstories/getUserStories': promise fulfilled, response.status === 200`);
			const userStoriesInfo = await response.json();	
			if (response.headers) {
				console.log(`response.headers = `);
				console.log(...response.headers);			
			}			
			return userStoriesInfo;
		}
		else {
			let errMessage;
			console.log(`'userstories/getUserStories': promise fulfilled, response.status is NOT 200, but ${response.status} response.headers = `);
			if (response.headers) {
				console.log(`response.headers = `);
				console.log(...response.headers);			
			}
			const contentTypeHeader = response.headers.get('Content-Type');
			console.log(`'userstories/getUserStories': contentTypeHeader = ${contentTypeHeader}`);
			if (contentTypeHeader?.startsWith("application/json")) {
				// errMessage = await response.json();
				const err = await response.json();
				errMessage = err.error.message;
			}
			else {
				errMessage = await response.text();
			}			
			console.log(`'userstories/getUserStories': errMessage = ${JSON.stringify(errMessage)}`);
			return rejectWithValue("Unable to retrieve data")
		}
	  }
	  catch (err) {
		console.log(`'userstories/getUserStories': we are in catch; err = ${err}; calling rejectWithValue(err)`);
		return rejectWithValue(err)
	  }
  }  
)


export const userStoriesSlice = createSlice({
  name: 'userstories',
  initialState,
  reducers: {
    changeStage: (state, action: PayloadAction<UserStoryStage>) => {
		console.log(`userStoriesSlice: action.payload.stage =  ${action.payload.stage}`);
		const id = action.payload.id;
		
		const stage = action.payload.stage;
		const stageImageUrl = ImageUrls[stage as keyof typeof ImageUrls];
		
		const ind = state.entities.findIndex((elem: UserStory) => {
			return elem.id === id
		});
		if (ind > -1) {		
			state.entities[ind].stage = stage;
			state.entities[ind].imageUrl = stageImageUrl;
		}
    },	 	  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserStories.pending, (state) => {
		state.loading = true
      })
      .addCase(getUserStories.fulfilled, (state, action) => {
		state.loading = false
        state.entities = action.payload;
		state.error = undefined;
      })
      .addCase(getUserStories.rejected, (state, action) => {
		  console.log(`We are in getUserStories.rejected: action = ${action} action.payload = ${action.payload} action.error = ${JSON.stringify(action.error)}`);
		state.loading = false;
		// state.error = action.error.message;
		state.error = action.payload as string;
      });
  },  
})

export const { changeStage } = userStoriesSlice.actions;

export const selectUserStories = (state: RootState) => state.userstories;

export const selectUserStory = (id: number) => (state: RootState) => state.userstories.entities[id];

export default userStoriesSlice.reducer;