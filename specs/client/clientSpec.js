describe("The Client App...", function() {
  var client; 
  
  beforeEach(function(){
    client = new AppClient();
  });
  
  it("is a constructable object", function() {
    expect(typeof client).not.toBeUndefined();
  });
});

//testing testing testing