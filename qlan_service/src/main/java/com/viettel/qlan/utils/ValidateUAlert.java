package com.viettel.qlan.utils;

public class ValidateUAlert {
	
	public ValidateUAlert() {
		
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
	  
	  public static boolean emailCheck(String s) {
//		  String regex =  "^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$";
//		  
//		  if(s.matches(regex)) {
//			  return true;
//		  }
		  return true;
	  }
	  
	  
	  public static boolean telCheck(String s) {
		 String regex2 ="^(0[1-9]{1,2}|\\+[0-9]{1,3})+([0-9]{8,11})$";
		  if(s.matches(regex2)) {
			  return true;
		  }
		  return false;
	  }
	
}
