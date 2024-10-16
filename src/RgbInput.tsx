import { useEffect, useState } from 'react';
import { ColorInputBaseProps } from '../node_modules/react-colorful/dist/types';
import styled from 'styled-components';

interface RGBInputProps extends ColorInputBaseProps {
    onChange?: (value: string) => void;
}

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: 10px;

    input {
        width: 60px;
        margin: 0 5px;
    }
`;

const extractColorValues = (colorString: string) => {
    const regex = /\(([^)]+)\)/;
    const match = regex.exec(colorString);
    return match ? match[1] : "";
};

export const RGBInput: React.FC<RGBInputProps> = ({ color, onChange }) => {
    const [rgb, setRgb] = useState<string>('rgb(0,0,0)');

    useEffect(() => {
        if (color) {
            setRgb(color); // Mantém a cor RGB em uma única string
        }
    }, [color]);

    // Atualiza o valor RGB a cada mudança
    useEffect(() => {
        if (onChange) {
            onChange(rgb); // Chama onChange com a string RGB
        }
    }, [rgb, onChange]);

    const handleInputChange = (index: number, value: string) => {
        const rgbValues = extractColorValues(rgb).split(',').map(Number);
        if (!isNaN(rgbValues[index])) {
            rgbValues[index] = Math.min(255, Math.max(0, Number(value))); // Garante que o valor esteja entre 0 e 255
        }
        setRgb(`rgb(${rgbValues.join(',')})`); // Atualiza a string RGB
    };

    return (
        <InputContainer>
            <label>RGB:</label>
            {['R', 'G', 'B'].map((label, index) => (
                <input
                    key={label}
                    type="text"
                    value={extractColorValues(rgb).split(',')[index] || '0'}
                    onChange={(e) => handleInputChange(index, e.target.value.replace(/\D/g, ''))}
                    placeholder={label}
                    maxLength={3}
                />
            ))}
        </InputContainer>
    );
};
