with open('words.txt') as data:
    print("var words = {")
    for each_line in data:
        if "'" not in each_line:
            each_line.lower()
            print("'{}': true,\n".format(each_line.strip().lower()), end = '')
    print("}")
