type Id : String(4);
using Student from './Student';


entity UniversityGroup {
    key unid : Id;
    name : String(100);
    studentsCount: Integer;
    curatorName: String(100);

    toStudents : association to many Student on toStudents.unid = unid;
};
