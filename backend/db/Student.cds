using Id from './UniversityGroup';
using Address_st from './Address';

entity Student {
    key stid : Id;
    unid : Id;
    name: String(100);
    surname : String(100);
    email: String(100);
    phoneNumber: String(100);

    toAddress : association to one Address_st on toAddress.stid = stid;
};