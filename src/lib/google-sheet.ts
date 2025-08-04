import { google } from 'googleapis';
import { Equipment, Booking, EquipmentAvailability } from './types';

const sheets = google.sheets('v4');

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Get equipment data from Google Sheets
export async function getEquipmentData(): Promise<Equipment[]> {
  try {
    const authClient = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_EQUIPMENT_SHEET_ID,
      range: 'Sheet1!A2:F', // Skip header row
    });

    const rows = response.data.values || [];
    return rows.map((row, index) => ({
      id: (index + 1).toString(),
      serialNumber: row[1] || '',
      name: row[2] || '',
      status: row[3] as Equipment['status'] || 'พร้อมใช้งาน',
      damage: row[4] || '',
      notes: row[5] || '',
    }));
  } catch (error) {
    console.error('Error fetching equipment data:', error);
    return [];
  }
}

// Get booking data from Google Sheets
export async function getBookingData(): Promise<Booking[]> {
  try {
    const authClient = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_BOOKINGS_SHEET_ID,
      range: 'Sheet1!A2:AZ', // Get all columns from row 2 onwards
    });

    const rows = response.data.values || [];
    return rows.map((row) => ({
      timestamp: row[0] || '',
      accepted: row[1] === 'ยอมรับ',
      year: row[2] || '',
      borrowDate: row[3] || '',
      borrowTime: row[4] || '',
      status: row[5] as Booking['status'] || 'รออนุมัติ',
      notes: row[6] || '',
      fullName: row[7] || '',
      studentId: row[8] || '',
      phone: row[9] || '',
      groupMembers: row[10] || '',
      subject: row[11] || '',
      customSubject: row[12] || '',
      instructor: row[13] || '',
      equipment1: row[14] || '',
      equipment2: row[15] || '',
      equipment3: row[16] || '',
      equipment4: row[17] || '',
      equipment5: row[18] || '',
      equipment6: row[19] || '',
      equipment7: row[20] || '',
      equipment8: row[21] || '',
      equipment9: row[22] || '',
      equipment10: row[23] || '',
      customEquipment: row[24] || '',
      activityEquipment: row[25] || '',
      formDocument: row[50] || '',
      studentCard: row[51] || '',
    }));
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return [];
  }
}

// Update equipment status
export async function updateEquipmentStatus(
  rowIndex: number,
  status: Equipment['status']
): Promise<boolean> {
  try {
    const authClient = await auth.getClient();
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_EQUIPMENT_SHEET_ID,
      range: `Sheet1!D${rowIndex + 2}`, // +2 because of header and 0-based index
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]],
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating equipment status:', error);
    return false;
  }
}

// Update booking status
export async function updateBookingStatus(
  rowIndex: number,
  status: Booking['status']
): Promise<boolean> {
  try {
    const authClient = await auth.getClient();
    await sheets.spreadsheets.values.update({
      auth: authClient,
      spreadsheetId: process.env.GOOGLE_BOOKINGS_SHEET_ID,
      range: `Sheet1!F${rowIndex + 2}`, // Status column
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]],
      },
    });
    return true;
  } catch (error) {
    console.error('Error updating booking status:', error);
    return false;
  }
}

// Calculate equipment availability for a specific date
export async function getEquipmentAvailability(date?: string): Promise<EquipmentAvailability[]> {
  const equipment = await getEquipmentData();
  const bookings = await getBookingData();

  // Group equipment by name
  const equipmentByName = equipment.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = [];
    }
    acc[item.name].push(item);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const availability: EquipmentAvailability[] = [];

  Object.entries(equipmentByName).forEach(([name, items]) => {
    const total = items.length;
    const unavailable = items.filter(item => item.status === 'ไม่พร้อมใช้งาน').length;
    const borrowed = items.filter(item => item.status === 'ใช้งานในภาควิชา').length;
    const available = total - unavailable - borrowed;

    // If date is specified, check bookings for that date
    if (date) {
      const dateBookings = bookings.filter(booking => 
        booking.borrowDate === date && 
        booking.status === 'อนุมัติแล้ว' &&
        [booking.equipment1, booking.equipment2, booking.equipment3, booking.equipment4, booking.equipment5,
         booking.equipment6, booking.equipment7, booking.equipment8, booking.equipment9, booking.equipment10]
        .some(eq => eq && eq.includes(name))
      );
      
      const bookedCount = dateBookings.length;
      const actualAvailable = Math.max(0, available - bookedCount);
      
      availability.push({
        name,
        total,
        available: actualAvailable,
        borrowed: borrowed + bookedCount,
        unavailable,
      });
    } else {
      availability.push({
        name,
        total,
        available,
        borrowed,
        unavailable,
      });
    }
  });

  return availability.sort((a, b) => a.name.localeCompare(b.name, 'th'));
}