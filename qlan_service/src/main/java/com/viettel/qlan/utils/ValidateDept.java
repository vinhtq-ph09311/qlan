package com.viettel.qlan.utils;

public class ValidateDept {

    
  private ValidateDept() {
	   
  }
   
  public static boolean Ischecknull(String str) {
	  if(str==null || str.trim().equals("")) {
		  return true;
	  }
	  return false;
  }
  
  
  public static boolean IscheckspecialCharacter(String str) {
	  String ch="^.*[!@#$%^&*()+\\=\\[\\]{};':\"\\\\|,.<>\\/?].*$" ;
	
	  if(str.matches(ch)) {	
		  return true;
	  }
	  
	  return false;
  }
  
  
  public static boolean IsCheckspecialCharacterCode(String str) {
	  String regex = "^.*[Ạ-ỹáàạảãâấầậẩẫăắằặẳẵÁÀẠẢÃÂẤẦẬẨẪĂẮẰẶẲẴéèẹẻẽêếềệểễÉÈẸẺẼÊẾỀỆỂỄóòọỏõôốồộổỗơớờợởỡÓÒỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠúùụủũưứừựửữÚÙỤỦŨƯỨỪỰỬỮíìịỉĩÍÌỊỈĨđĐýỳỵỷỹÝỲỴỶỸ].*$";
	  if(str.matches(regex)) {
		  return true ;
	  }
	  return false;
  }
  
  public static boolean hasWhiteSpace(String s) {
      String regex = "^.*[ ].*$";
      if (s.matches(regex)) {
          return true;
      }
      return false;
  }
  
  public static boolean htmlCheck(String s) {
      String regex = "^.*[<>].*$";
      if (s.matches(regex)) {
          return true;
      }
      return false;
  }
  
  
  public static boolean checkDeptStatus(Long status) {
	  if(status != 1 || status != 0) {
		  return false;
	  }
	  return true;
  }
  
  public static boolean checkMaxLength(String s) {
	  if(s.trim().length() > 100) {
		  return true;
	  }
	  return false;
  }
   
}
