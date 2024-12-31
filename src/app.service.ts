import { Injectable, UnsupportedMediaTypeException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async processCVFile(file) {
    const mimeType = file.mimetype;

    // Basic check for PDF
    if (mimeType === 'application/pdf') {
      const text = await this.extractPDFText(file.buffer);
      const suggestions = this.analyzeTextAndGetSuggestions(text);
      return { suggestions };
    } else if (
      mimeType ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      // Alternatively, you can use a library like textract here.
      const text = await this.extractDocxText(file.buffer);
      const suggestions = this.analyzeTextAndGetSuggestions(text);
      return { suggestions };
    } else {
      throw new UnsupportedMediaTypeException(
        'Only PDF or DOC/DOCX files are supported for now',
      );
    }
  }

  private async extractPDFText(buffer): Promise<string> {
    const result = await pdfParse(buffer);
    return result.text;
  }

  private async extractDocxText(buffer): Promise<string> {
    // For simplicity, you could use `textract` or any other library
    // Example with textract:
    // const extract = require('textract');
    // return new Promise((resolve, reject) => {
    //   extract.fromBufferWithName('file.docx', buffer, (error, text) => {
    //     if (error) return reject(error);
    //     resolve(text);
    //   });
    // });
    return 'DOCX text extraction not implemented yet';
  }

  private analyzeTextAndGetSuggestions(cvText: string) {
    // We'll parse the cvText to generate basic suggestions
    return this.getNlpSuggestions(cvText);
  }

  private getNlpSuggestions(text: string) {
    // TODO: Implement your own heuristic or NLP-based approach
    return [
      'Check grammar and spelling.',
      'Highlight programming languages more clearly.',
      'Emphasize achievements rather than responsibilities.',
    ];
  }
}
