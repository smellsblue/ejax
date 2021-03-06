/* DO NOT EDIT THIS FILE - it is machine generated */
#include <jni.h>
/* Header for class org_ejax_Curses */

#ifndef _Included_org_ejax_Curses
#define _Included_org_ejax_Curses
#ifdef __cplusplus
extern "C" {
#endif
/*
 * Class:     org_ejax_Curses
 * Method:    install
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_org_ejax_Curses_install
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    uninstall
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_org_ejax_Curses_uninstall
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    nl
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_nl
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    nonl
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_nonl
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    cbreak
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_cbreak
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    nocbreak
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_nocbreak
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    raw
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_raw
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    noraw
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_noraw
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    qiflush
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_org_ejax_Curses_qiflush
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    noqiflush
 * Signature: ()V
 */
JNIEXPORT void JNICALL Java_org_ejax_Curses_noqiflush
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    echo
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_echo
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    noecho
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_noecho
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    keypad
 * Signature: (Z)I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_keypad
  (JNIEnv *, jclass, jboolean);

/*
 * Class:     org_ejax_Curses
 * Method:    timeout
 * Signature: (I)V
 */
JNIEXPORT void JNICALL Java_org_ejax_Curses_timeout
  (JNIEnv *, jclass, jint);

/*
 * Class:     org_ejax_Curses
 * Method:    beep
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_beep
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    clear
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_clear
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    refresh
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_refresh
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    move
 * Signature: (II)I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_move
  (JNIEnv *, jclass, jint, jint);

/*
 * Class:     org_ejax_Curses
 * Method:    mvaddch
 * Signature: (IIII)I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_mvaddch
  (JNIEnv *, jclass, jint, jint, jint, jint);

/*
 * Class:     org_ejax_Curses
 * Method:    A_REVERSE
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_A_1REVERSE
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    read
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_read
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    unread
 * Signature: (I)I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_unread
  (JNIEnv *, jclass, jint);

/*
 * Class:     org_ejax_Curses
 * Method:    rows
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_rows
  (JNIEnv *, jclass);

/*
 * Class:     org_ejax_Curses
 * Method:    columns
 * Signature: ()I
 */
JNIEXPORT jint JNICALL Java_org_ejax_Curses_columns
  (JNIEnv *, jclass);

#ifdef __cplusplus
}
#endif
#endif
