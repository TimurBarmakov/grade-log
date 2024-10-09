import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, message } from 'antd';
import { useDispatch } from 'react-redux';
import { updateGrade } from '../store/gradesSlice';

interface GradeModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  selectedGrade: any;
}

const GradeModal: React.FC<GradeModalProps> = ({ visible, onClose, title, selectedGrade }) => {
  const [mark, setMark] = useState<number | undefined>(undefined); 
  const dispatch = useDispatch();

  useEffect(() => {

    if (selectedGrade) {
      const currentMark = selectedGrade?.marks?.[0]?.mark; 
      setMark(currentMark !== undefined ? currentMark : undefined);
    }
  }, [selectedGrade]);

  const handleSave = () => {
    if (mark === undefined || mark < 0 || mark > 100) {
        message.error('Пожалуйста, введите значение от 0 до 100');
        return;
    }
    const fieldKey = selectedGrade.fieldKey;
    const studentFio = selectedGrade.fio;
    dispatch(updateGrade({ key: fieldKey, mark, fio: studentFio, selectedGrade })); // Send the field key, mark, and fio

    message.success('Оценка успешно обновлена');
    onClose();
};



  return (
    <Modal 
      title={title}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Закрыть
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Сохранить
        </Button>,
      ]}
    >
      <div>
        {selectedGrade && (
          <div>
            <p>Введите балл (0-100)</p>
            <Input 
              type="number" 
              value={mark} 
              onChange={(e) => setMark(Number(e.target.value))}
              placeholder="Введите балл (0-100)" 
              min={0}
              max={100}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GradeModal;

