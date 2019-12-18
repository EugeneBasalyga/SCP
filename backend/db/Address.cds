using Id from './UniversityGroup';

entity Address_st {
    key adid : Id;
    stid : Id;
    city : String(100);
    street : String(100);
    houseNum : Integer;
    flatNum: Integer;
};