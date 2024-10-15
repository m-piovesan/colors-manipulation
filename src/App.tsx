import './App.css';
import { useState } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { HexColorPicker, HexColorInput} from "react-colorful";
import { theme as defaultTheme } from './assets/themes';
import { darken, lighten } from 'polished';
import Color from 'color';

const formatHslString = (hslString: string) => {
    return hslString.replace(/(\d+\.\d+),/g, (match) => {
        const number = parseFloat(match);
        return `${number.toFixed(1)},`;
    });
};

const extractColorValues = (colorString: string) => {
    const regex = /\(([^)]+)\)/;
    const match = regex.exec(colorString); // Regex para encontrar valores dentro dos parênteses
    return match ? match[1] : ""; // Retorna os valores ou null se não encontrado
};

function App() {
    const [newColor, setNewColor] = useState("#561ecb");
    const [theme, setTheme] = useState<DefaultTheme>(defaultTheme);

    // Converte o valor hexadecimal para RGB e HSL
    const rgbValue = Color(newColor).rgb().string();
    const hslValue = Color(newColor).hsl().string();
    

    // TODO: essa função tem que servir para salvar o novo tema no back
    const handleColorChange = () => {
        const lighterSecondary = lighten(0.3, newColor);
        const darkerBg = darken(0.3, newColor);

        setTheme((prevTheme) => ({
            ...prevTheme,
            colors: {
                ...prevTheme.colors,
                primary: newColor,
                secondary: lighterSecondary,
                background: darkerBg,
            },
        }));
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <h2 style={{ color: theme.colors.primary }}>cor salva no banco (atual)</h2>
                <h3 style={{ color: theme.colors.secondary }}>cor secundária que está no banco</h3>
                
                <h2 style={{ color: newColor }}>alterando a cor primária</h2>
                <h3 style={{ color: lighten(0.3, newColor) }}>alterandcor secundária</h3>

                <label>HEX:</label>
                <HexColorInput color={newColor} onChange={setNewColor} />

                <label>HSL:</label>
                <input type="text" value={extractColorValues(formatHslString(hslValue))} />
                
                <label>RGB:</label>
                <input type="text" value={extractColorValues(rgbValue)} />

                <HexColorPicker
                    color={newColor}
                    onChange={setNewColor}
                />

                <button onClick={handleColorChange} style={{marginTop: '10px'}}>
                    Enviar
                </button>
            </div>
        </ThemeProvider>
    );
}

export default App;
