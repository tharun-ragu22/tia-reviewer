import '@testing-library/jest-dom';
import FileUpload from '../app/components/FileUpload';

import '@testing-library/jest-dom';
import { render, screen, act } from '@testing-library/react';
import React from 'react';
describe('FileUpload component', () => {
    it('renders the file upload form', () => {
        const { getByText, getByLabelText } = render(<FileUpload />);
    });
})