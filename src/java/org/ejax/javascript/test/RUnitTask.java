package org.ejax.javascript.test;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.DirectoryScanner;
import org.apache.tools.ant.Project;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Execute;
import org.apache.tools.ant.taskdefs.LogStreamHandler;
import org.apache.tools.ant.types.CommandlineJava;
import org.apache.tools.ant.types.FileSet;
import org.apache.tools.ant.types.Path;
import org.apache.tools.ant.types.Reference;

public class RUnitTask extends Task {
    private Path classpath;
    private List<FileSet> files;
    private CommandlineJava javaCommand;
    private String testsToRun = "";

    public void addFileset(FileSet fileSet) {
        getFiles().add(fileSet);
    }

    @Override
    public void execute() throws BuildException {
        CommandlineJava cmd = getJavaCommand();
        cmd.setClassname(org.ejax.javascript.Execute.class.getName());
        cmd.createArgument().setValue("runit.js");
        cmd.createArgument().setValue("runit");
        cmd.createArgument().setValue("#" + testsToRun);
        List<String> argv = new ArrayList<String>();

        for (FileSet fileSet : getFiles()) {
            for (String file : files(fileSet)) {
                argv.add(file);
            }
        }

        String argsFilename = "";
        FileWriter fileWriter = null;
        BufferedWriter bufferedWriter = null;

        try {
            File file = File.createTempFile("runit", "");
            argsFilename = file.getAbsolutePath();
            file.deleteOnExit();
            fileWriter = new FileWriter(file);
            bufferedWriter = new BufferedWriter(fileWriter);

            for (String arg : argv) {
                bufferedWriter.write(arg);
                bufferedWriter.newLine();
            }

            bufferedWriter.flush();
        } catch (IOException e) {
            throw new BuildException("Failure while building arguments file.", e);
        } finally {
            try {
                if(bufferedWriter != null) {
                    bufferedWriter.close();
                }

                if(fileWriter != null) {
                    fileWriter.close();
                }
            } catch(IOException e) {
                throw new BuildException("Failure while building arguments file.", e);
            }
        }

        cmd.createArgument().setValue("@" + argsFilename);
        Execute execute = new Execute(new LogStreamHandler(this, Project.MSG_INFO, Project.MSG_WARN));
        execute.setCommandline(cmd.getCommandline());
        execute.setAntRun(getProject());
        log(cmd.describeCommand(), Project.MSG_VERBOSE);
        int exitValue;

        try {
            exitValue = execute.execute();
        } catch (IOException e) {
            throw new BuildException("Process fork failed.", e);
        }

        if (exitValue != 0) {
            throw new BuildException("One or more RUnit tests failed.");
        }
    }

    protected List<String> files(FileSet fileSet) {
        List<String> result = new LinkedList<String>();
        DirectoryScanner scanner = fileSet.getDirectoryScanner(getProject());
        String[] includedFiles = scanner.getIncludedFiles();

        for(String filename : includedFiles) {
            File base  = scanner.getBasedir();
            File file = new File(base, filename);
            result.add(file.getAbsolutePath());
        }

        return result;
    }

    public void setClasspath(Path path) {
        getClasspath().append(path);
    }

    public void setClasspathRef(Reference reference) {
        getClasspath().setRefid(reference);
    }

    public void setFilesetRef(Reference reference) {
        FileSet fileSet = new FileSet();
        fileSet.setRefid(reference);
        fileSet.setProject(getProject());
        getFiles().add(fileSet);
    }

    public void setTestsToRun(String value) {
        if (value != null) {
            testsToRun = value;
        }
    }

    protected Path getClasspath() {
        if (classpath == null) {
            classpath = getJavaCommand().createClasspath(getProject()).createPath();
        }

        return classpath;
    }

    protected List<FileSet> getFiles() {
        if (files == null) {
            files = new LinkedList<FileSet>();
        }

        return files;
    }

    protected CommandlineJava getJavaCommand() {
        if(javaCommand == null) {
            javaCommand= new CommandlineJava();
        }

        return javaCommand;
    }
}
