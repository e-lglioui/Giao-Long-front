import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Instructor, InstructorUpdateDto, instructorService } from './services/instructor.service';

interface InstructorState {
  instructors: Instructor[];
  currentInstructor: Instructor | null;
  loading: boolean;
  error: string | null;
}

const initialState: InstructorState = {
  instructors: [],
  currentInstructor: null,
  loading: false,
  error: null,
};

export const fetchInstructors = createAsyncThunk(
  'instructors/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await instructorService.getAllInstructors();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch instructors');
    }
  }
);

export const fetchInstructorById = createAsyncThunk(
  'instructors/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await instructorService.getInstructorById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch instructor');
    }
  }
);

export const createInstructor = createAsyncThunk(
  'instructors/create',
  async (instructor: Omit<Instructor, 'id'>, { rejectWithValue }) => {
    try {
      return await instructorService.createInstructor(instructor);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create instructor');
    }
  }
);

export const updateInstructor = createAsyncThunk(
  'instructors/update',
  async ({ id, updateData }: { id: string; updateData: InstructorUpdateDto }, { rejectWithValue }) => {
    try {
      return await instructorService.updateInstructor(id, updateData);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update instructor');
    }
  }
);

export const deleteInstructor = createAsyncThunk(
  'instructors/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await instructorService.deleteInstructor(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete instructor');
    }
  }
);

export const addInstructorToSchool = createAsyncThunk(
  'instructors/addToSchool',
  async ({ schoolId, instructor }: { schoolId: string; instructor: Omit<Instructor, 'id'> }, { rejectWithValue }) => {
    try {
      return await instructorService.addInstructorToSchool(schoolId, instructor);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add instructor to school');
    }
  }
);

export const assignInstructorToSchool = createAsyncThunk(
  'instructors/assignToSchool',
  async ({ schoolId, instructorId }: { schoolId: string; instructorId: string }, { rejectWithValue }) => {
    try {
      await instructorService.assignInstructorToSchool(schoolId, instructorId);
      return { schoolId, instructorId };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to assign instructor to school');
    }
  }
);

const instructorSlice = createSlice({
  name: 'instructors',
  initialState,
  reducers: {
    clearCurrentInstructor: (state) => {
      state.currentInstructor = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all instructors
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch instructor by ID
      .addCase(fetchInstructorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInstructor = action.payload;
      })
      .addCase(fetchInstructorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create instructor
      .addCase(createInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors.push(action.payload);
        state.currentInstructor = action.payload;
      })
      .addCase(createInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update instructor
      .addCase(updateInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstructor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.instructors.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.instructors[index] = action.payload;
        }
        state.currentInstructor = action.payload;
      })
      .addCase(updateInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete instructor
      .addCase(deleteInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructors = state.instructors.filter((i) => i.id !== action.payload);
        if (state.currentInstructor?.id === action.payload) {
          state.currentInstructor = null;
        }
      })
      .addCase(deleteInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add instructor to school
      .addCase(addInstructorToSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addInstructorToSchool.fulfilled, (state, action) => {
        state.loading = false;
        const instructor = action.payload;
        state.instructors.push(instructor);
        state.currentInstructor = instructor;
      })
      .addCase(addInstructorToSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Assign instructor to school
      .addCase(assignInstructorToSchool.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignInstructorToSchool.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignInstructorToSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentInstructor, setError } = instructorSlice.actions;
export default instructorSlice.reducer;
