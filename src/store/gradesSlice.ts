import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Grade {
  id: any;
  studentName: string;
  score: number | null;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  date?: string;
  theme?: string | null;
  type?: string;
}

export interface GradesState {
  grades: any;
}

const initialState: GradesState = {
  grades: [],
};

const gradesSlice = createSlice({
  name: 'grades',
  initialState,
  reducers: {
    setGrades: (state: { grades: any; }, action: PayloadAction<Grade[]>) => {
      state.grades = action.payload;
    },
    updateGrade: (state: GradesState, action: PayloadAction<{ key: string; mark: any; fio: string; selectedGrade: any }>) => {
      const { key, mark, fio } = action.payload;
    
      const grade = state.grades.data.find((g: { fio: string }) => g.fio === fio);
    
      if (grade) {
        if (!grade[key]) {
          grade[key] = {
            type:  'basic',
            date: null,
            theme: null,
            marks: false,
            isAdd: false,
          };
        }
    
        if (mark === null) {
          grade[key].marks = false;
          grade[key].isAdd = true;
        } else {
          const marks = grade[key].marks || [];
    
          const existingMarkIndex = marks.findIndex((m: any) => m.isEdit); 
          if (existingMarkIndex >= 0) {
            marks[existingMarkIndex].mark = mark;
          } else {
            marks.push({
              id: Math.random(),
              mark,
              isEdit: true,
              isDelete: true,
            });
            grade[key].isAdd = false; 
          }
          grade[key].marks = marks;
        }
      }
    },
    
  },
});

export const { setGrades,  updateGrade } = gradesSlice.actions;

export default gradesSlice.reducer;
