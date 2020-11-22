public class SymbolBalance implements SymbolBalanceInterface{
    
    private String filename;
    private char currentSymbol;
    private char symbolPopped;
    private int lineNumber;
    private boolean comment=false;
    private boolean quote=false;
    private int charInLine=0;
    private String str;
    private char topElement;
    private int sizeOfStack;
    private MyStack<Character> s = new MyStack<>();
    
    public void setFile(String filename){
        this.filename = filename;
    }
    
    public BalanceError checkFile() {
        try{
            Scanner x = new Scanner(new File(this.filename));
            
            while(x.hasNextLine()){
                str = x.nextLine();
                lineNumber=lineNumber+1;
                charInLine=str.length();
                int i=0;
                while(i<charInLine){
                    currentSymbol = str.charAt(i);
                    System.out.println(currentSymbol);
                    if(currentSymbol=='"' && quote ==false){
                        s.push(currentSymbol);
                        quote = true;
                    }else if(currentSymbol=='"' && quote ==true){
                        if(s.isEmpty()==true){
                            BalanceError toReturn = new EmptyStackError(lineNumber);
                            return toReturn;
                        }else if(s.peek()=='"'){
                            s.pop();
                            quote = false;
                        }else{
                            BalanceError toReturn = new MismatchError(lineNumber, currentSymbol, symbolPopped);
                            return toReturn;
                        } 
                    }else if(i!=0 && comment ==false && currentSymbol=='*' && str.charAt(i-1)=='/'){
                        s.push(currentSymbol);
                        comment=true;
                    }else if(i!=0 && comment ==true && currentSymbol=='/' && str.charAt(i-1)=='*'){
                        if(s.isEmpty()==true){
                           BalanceError toReturn = new EmptyStackError(lineNumber);
                           return toReturn;
                       }else if(s.peek()=='*'){
                           s.pop();
                           comment=false;
                       }else{
                           BalanceError toReturn = new MismatchError(lineNumber, currentSymbol, symbolPopped);
                           return toReturn;
                       }
                    }else if(quote==false && comment == false && currentSymbol=='{' || currentSymbol== '(' || currentSymbol=='['){
                        s.push(currentSymbol);
                    }else if(quote==false && comment ==false && currentSymbol=='}'){
                        if(s.isEmpty()==true){
                            BalanceError toReturn = new EmptyStackError(lineNumber);
                            return toReturn;
                        }else if(s.peek()=='{'){
                            s.pop();
                        }else{
                            BalanceError toReturn = new MismatchError(lineNumber, currentSymbol, symbolPopped);
                            return toReturn;
                        }
                    }else if(quote==false && comment ==false && currentSymbol==')'){
                        if(s.isEmpty()==true){
                            BalanceError toReturn = new EmptyStackError(lineNumber);
                            return toReturn;
                        }else if(s.peek()=='('){
                            s.pop();
                        }else{
                            BalanceError toReturn = new MismatchError(lineNumber, currentSymbol, symbolPopped);
                            return toReturn;
                        } 
                    }else if(quote==false && comment ==false && currentSymbol==']'){
                       if(s.isEmpty()==true){
                           BalanceError toReturn = new EmptyStackError(lineNumber);
                           return toReturn;
                       }else if(s.peek()=='['){
                           s.pop();
                       }else{
                           BalanceError toReturn = new MismatchError(lineNumber, currentSymbol, symbolPopped);
                           return toReturn;
                       }    
                   } 
                   i++; 
                }   
            }
            
        x.close();
        }catch(FileNotFoundException e){
            e.printStackTrace();
        }
        
        
        if(s.isEmpty()==false){
             BalanceError toReturn = new NonEmptyStackError(topElement, sizeOfStack);
             return toReturn;
        }else{
             return null; 
        }
        /*    
            while(x.hasNext()){
                str = x.nextLine();
                //System.out.println(str);
                for(int i=0; i<str.length();i++){
                    currentSymbol = str.charAt(i);
                    //System.out.println(currentSymbol);
                    */
        
    }
    
}