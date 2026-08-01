export const company = {
  name: 'Him- Trail Travel & Treks Pvt. Ltd',
  shortName: 'Him-Trail',
  regNo: '95283/069/070',
  vatNo: '600657565',
  address: 'Koteshwor, Kathmandu',
  country: 'Nepal',
  website: 'www.himtrail.com',
  email: 'himtrail@gmail.com',
  telephone: '977-1-4154044',
  mobile: '9841715841',
  fax: '',
  poBox: '847',
  keyPerson: 'Anup Rimal',
  establishmentDate: '01-11-2019',
  whatsappCountryCode: '+977',
  whatsappNumber: '9841715841',
};

export const buildWhatsAppUrl = (countryCode, phoneNumber, message = '') => {
  const digits = `${countryCode || ''}${phoneNumber || ''}`.replace(/\D/g, '');
  if (!digits) return '';
  const text = encodeURIComponent(message || 'Hello');
  return `https://wa.me/${digits}?text=${text}`;
};
