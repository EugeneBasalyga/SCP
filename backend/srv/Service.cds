using Student as _Student from '../db/Student';
using Address_st as _Address_st from '../db/Address';
using UniversityGroup as _UniversityGroup from '../db/UniversityGroup';

service odata {

  entity Students @(
		title: 'Students'
	) as projection on _Student;

  entity Address_st @(
		title: 'Address'
	) as projection on _Address_st;

    entity UniversityGroups @(
		title: 'UniversityGroups'
	) as projection on _UniversityGroup;

}