const { google } = require('googleapis');
const path = require('path');
const stream = require('stream');

// Cargamos las credenciales de Service Account que ya usas para Firebase
const KEYFILEPATH = path.join(__dirname, '../../serviceAccountKey.json');
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

async function subirArchivoADrive(fileObject, nombreUsuario) {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);

    const folderId = '1D4GTOST_argbZu_Pnj15Ns5B_XewdHEp'; // Tu ID de carpeta

    const fileMetadata = {
        name: `Cedula_${nombreUsuario}_${Date.now()}${path.extname(fileObject.originalname)}`,
        parents: [folderId],
    };

    const media = {
        mimeType: fileObject.mimetype,
        body: bufferStream,
    };

    try {
        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });
        return response.data;
    } catch (error) {
        console.error('Error al subir a Google Drive:', error);
        throw error;
    }
}

module.exports = { subirArchivoADrive };