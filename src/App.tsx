import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button } from 'antd';
import { RootState } from './store';
import { setGrades, updateGrade } from './store/gradesSlice'; 
import GradeModal from './components/GradeModal';
import { CloseOutlined } from '@ant-design/icons';

const GradesTable: React.FC = () => {
  const grades = useSelector((state: RootState) => state.grades.grades);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.bilimal.kz/handbook/v1/test");
        const data = await response.json();
        dispatch(setGrades(data));
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const extractMarks = (grade: any, key: string) => {
    const result: any[] = [];
    const value = grade[key];

    if (value && value.marks) { 
      const marks = value.marks;
      if (Array.isArray(marks)) {
        marks.forEach((mark: any) => {
          if (mark && mark.mark !== null) {
            result.push(
              <div className='mark-container fw600' key={`${key}-${mark.id}`}>
                {mark.mark}
                {mark.isDelete && (
                  <Button 
                    type="link" 
                    icon={<CloseOutlined />} 
                    onClick={(e) => handleDeleteMark(e, grade.fio, key, selectedGrade)}
                    style={{ marginLeft: '5px'}}
                  />
                )}
              </div>
            );
          }
        });
      }
    }

    return result.length > 0 ? result : <div>Нет оценки</div>;
  };

  const handleDeleteMark = (e: React.MouseEvent, fio: string, key: string, selectedGrade: any) => {
    e.stopPropagation();
    dispatch(updateGrade({ fio, key, mark: null, selectedGrade }));
  };

  const handleCellClick = (grade: any, column: any) => {
    const studentName = grade.fio;
    const columnKey = column.key;
  
    const selectedData = grade[columnKey];
    const hasMarks = selectedData && selectedData.marks && selectedData.marks.length > 0;
  
    if (selectedData && !selectedData.isAdd) {
      if (hasMarks && selectedData.marks.some((mark: any) => mark.isEdit)) {
        setModalTitle(`Редактирование оценки - ${studentName}`);
        setSelectedGrade({ ...selectedData, fieldKey: columnKey, fio: studentName, selectedGrade: selectedData });
        setIsModalVisible(true);
        return;
      }
      return; 
    }
  
    if (!hasMarks) {
      setModalTitle(`Выставление оценки - ${studentName}`);
      setSelectedGrade({ fieldKey: columnKey, fio: studentName, selectedGrade: selectedData });
    } else {
      setModalTitle(`Редактирование оценки - ${studentName}`);
      setSelectedGrade({ ...selectedData, fieldKey: columnKey, fio: studentName, selectedGrade: selectedData });
    }
  
    setIsModalVisible(true);
  };
  
  
  

  const renderColumns = (columns: any[]) => {
    return columns.map((column: any) => {
      const columnStyle = {
        backgroundColor: column['background-color'],
      };

      if (column.children) {
        return (
          <Table.ColumnGroup
            key={column.key}
            title={column.title}
            onHeaderCell={() => ({
              style: columnStyle,
            })}
            onCell={() => ({
              style: columnStyle,
            })}
            align="center"
          >
            {renderColumns(column.children)}
          </Table.ColumnGroup>
        );
      }

      return (
        <Table.Column
          key={column.key}
          title={column.title}
          dataIndex={column.dataIndex}
          render={(text: any, grade: any) => {
            if (column.dataIndex === 'fio' || column.dataIndex === 'number') {
              return <div>{grade[column.dataIndex]}</div>;
            }
        

            return (
              <div style={{ textAlign: 'center' }} onClick={() => handleCellClick(grade, column)}>
                {extractMarks(grade, column.key)}
              </div>
            );
          }}
          onHeaderCell={() => ({
            style: columnStyle,
          })}
          onCell={() => ({
            style: columnStyle,
          })}
          width={column.fixedWidth || 300}
          className={column.dataIndex === 'fio' || column.dataIndex === 'number' ? 'fw600' : ''} // Добавляем классы для ФИО и номер
          />
      );
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedGrade(null);
  };

  return (
    <>
      <div className='logBlock' style={{ gap: '20px' }}>
        <span className="fz26 fw600">Журнал оценок</span>
        {grades && grades.columns && (
          <Table dataSource={grades.data} rowKey="id">
            {renderColumns(grades.columns)}
          </Table>
        )}
      </div>

      <GradeModal
        visible={isModalVisible}
        onClose={handleModalClose}
        title={modalTitle}
        selectedGrade={selectedGrade}
      />
    </>
  );
};

export default GradesTable;
