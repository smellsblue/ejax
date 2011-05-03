#include "ejaxnative.h"
#include <curses.h>

JNIEXPORT jint JNICALL Java_org_ejax_Curses_install(JNIEnv *env, jclass clazz) {
  initscr();
  return 0;
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_uninstall(JNIEnv *env, jclass clazz) {
  endwin();
  return 0;
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_nl(JNIEnv *env, jclass clazz) {
  return nl();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_nonl(JNIEnv *env, jclass clazz) {
  return nonl();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_cbreak(JNIEnv *env, jclass clazz) {
  return cbreak();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_nocbreak(JNIEnv *env, jclass clazz) {
  return nocbreak();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_raw(JNIEnv *env, jclass clazz) {
  return raw();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_noraw(JNIEnv *env, jclass clazz) {
  return noraw();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_echo(JNIEnv *env, jclass clazz) {
  return echo();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_noecho(JNIEnv *env, jclass clazz) {
  return noecho();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_keypad(JNIEnv *env, jclass clazz, jboolean value) {
  return keypad(stdscr, value);
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_clear(JNIEnv *env, jclass clazz) {
  return clear();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_refresh(JNIEnv *env, jclass clazz) {
  return refresh();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_move(JNIEnv *env, jclass clazz, jint x, jint y) {
  return move(y, x);
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_write(JNIEnv *env, jclass clazz, jint x, jint y, jint c) {
  return mvaddch(y, x, c);
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_read(JNIEnv *env, jclass clazz) {
  return getch();
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_rows(JNIEnv *env, jclass clazz) {
  int rows, columns;
  getmaxyx(stdscr, rows, columns);
  return rows;
}

JNIEXPORT jint JNICALL Java_org_ejax_Curses_columns(JNIEnv *env, jclass clazz) {
  int rows, columns;
  getmaxyx(stdscr, rows, columns);
  return columns;
}
