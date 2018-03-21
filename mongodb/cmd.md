## 1 安装

- 接下来我们使用 curl 命令来下载安装：

```
# 进入 /usr/local
cd /usr/local

# 下载
sudo curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.4.2.tgz

# 解压
sudo tar -zxvf mongodb-osx-x86_64-3.4.2.tgz

# 重命名为 mongodb 目录

sudo mv mongodb-osx-x86_64-3.4.2 mongodb
```

- 安装完成后，我们可以把 MongoDB 的二进制命令文件目录（安装目录/bin）添加到 PATH 路径中：

```
export PATH=/usr/local/mongodb/bin:$PATH
```


- 1、首先我们创建一个数据库存储目录 /data/db：

```bash
sudo mkdir -p /data/db
```

- 启动 mongodb，默认数据库目录即为 /data/db：

```bash
sudo mongod

# 如果没有创建全局路径 PATH，需要进入以下目录
cd /usr/local/mongodb/bin
sudo ./mongod
```


- 再打开一个终端进入执行以下命令：

```
$ cd /usr/local/mongodb/bin 
$ ./mongo
MongoDB shell version v3.4.2
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.2
Welcome to the MongoDB shell.
```


## 2 操作

- 运行s：这时候服务就可以开启了，链接默认端口是27017。

- 链接服务端，链接命令是mongo
	- 查看存在数据库命令：show dbs
	- 查看数据库版本命令：db.version()


- show dbs :显示已有数据库，如果你刚安装好，会默认有local、admin(config)，这是MongoDB的默认数据库，我们在新建库时是不允许起这些名称的。

- use admin： 进入数据，也可以理解成为使用数据库。成功会显示：switched to db admin。

- show collections: 显示数据库中的集合（关系型中叫表，我们要逐渐熟悉）。

- db:显示当前位置，也就是你当前使用的数据库名称，这个命令算是最常用的，因为你在作任何操作的时候都要先查看一下自己所在的库，以免造成操作错误。

- use db（建立数据库）：use不仅可以进入一个数据库，如果你敲入的库不存在，它还可以帮你建立一个库。但是在没有集合前，它还是默认为空。
- db.集合.insert( ):新建数据集合和插入文件（数据），当集合没有时，这时候就可以新建一个集合，并向里边插入数据。Demo：db.user.insert({"name":"jspang"})

- db.集合.find( ):查询所有数据，这条命令会列出集合下的所有数据，可以看到MongoDB是自动给我们加入了索引值的。Demo：db.user.find()
- db.集合.findOne( ):查询第一个文件数据，这里需要注意的，所有MongoDB的组合单词都使用首字母小写的驼峰式写法。
- db.集合.update({查询},{修改}):修改文件数据，第一个是查询条件，第二个是要修改成的值。这里注意的是可以多加文件数据项的，比如下面的例子。

```
db.jspang.update({"name":"jspang"},{"name":"jspang","age":"32"})
```


- db.集合.remove(条件)：删除文件数据，注意的是要跟一个条件。Demo:db.user.remove({"name":"jspang"})


- db.集合.drop( ):删除整个集合，这个在实际工作中一定要谨慎使用，如果是程序，一定要二次确认。


- db.dropDatabase( ):删除整个数据库，在删除库时，一定要先进入数据库，然后再删除。实际工作中这个基本不用，实际工作可定需要保留数据和痕迹的。

### 修改：初识update修改器

- $set修改器
	- 用来修改一个指定的键值(key),这时候我们要修改上节课的sex和age就非常方便了，只要一句话就可以搞定


	```
	db.workmate.update({"name":"MinJie"},{"$set":{sex:2,age:21}})
	
	```

	- 修改嵌套内容(内嵌文档)

	```
	db.workmate.update({"name":"MinJie"},{"$set":{"skill.skillThree":'word'}})
	```

- $unset用于将key删除

```
db.workmate.update({"name":"MinJie"},{$unset:{"age":''}})
```

- $inc对数字进行计算

```
db.workmate.update({"name":"MinJie"},{$inc:{"age":-2}})
```

- multi选项

```
db.workmate.update({},{$set:{interset:[]}})

db.workmate.update({},{$set:{interset:[]}},{multi:true})
```

- upsert选项
	- upsert是在找不到值的情况下，直接插入这条数据。比如我们这时候又来了一个新同事xiaoWang，我们这时候修改他的信息，age设置成20岁，但集合中并没有这条数据。这时候可以使用upsert选项直接添加。 
	- upsert也有两个值：true代表没有就添加，false代表没有不添加(默认值)。


	```
	db.workmate.update({name:'xiaoWang'},{$set:{age:20}},{upsert:true})
	```

### 修改：update数组修改器

- $push追加数组/内嵌文档值
	- $push的功能是追加数组中的值，但我们也经常用它操作内嵌稳文档，就是{}对象型的值。先看一个追加数组值的方式，比如我们要给小王加上一个爱好(interset)为画画（draw）：

	```
	db.workmate.update({name:'xiaoWang'},{$push:{interest:'draw'}})
	``` 

	- 当然$push修饰符还可以为内嵌文档增加值，比如我们现在要给我们的UI，增加一项新的技能skillFour为draw，这时候我们可以操作为：

	```
	db.workmate.update({name:'MinJie'},{$push:{"skill.skillFour":'draw'}})
	```

- $ne查找是否存在(总结：有则不修改, 没有则修改。)
	- 它主要的作用是，检查一个值是否存在，如果不存在再执行操作，存在就不执行，这个很容易弄反，记得我刚学的时候就经常弄反这个修改器的作用，给自己增加了很多坑。

	```
	例子：如果xiaoWang的爱好（interest）里没有palyGame这个值，我们就加入Game这个爱好。
	db.workmate.update({name:'xiaoWang',"interest":{$ne:'playGame'}},{$push:{interest:'Game'}})
	```


- $addToSet 升级版的$ne
	- 它是$ne的升级版本（查找是否存在，不存在就push上去），操作起来更直观和方便，所以再工作中这个要比$en用的多。
	- 例子：我们现在要查看小王(xiaoWang)兴趣(interest)中有没有阅读（readBook）这项，没有则加入读书(readBook)的兴趣.

	```
	db.workmate.update({name:"xiaoWang"},{$addToSet:{interest:"readBook"}})
	```


- $each 批量追加
	- 例子：我们现在要给xiaoWang,一次加入三个爱好，唱歌（Sing），跳舞（Dance），编码（Code）。

	```
	var newInterset=["Sing","Dance","Code"];
	db.workmate.update({name:"xiaoWang"},{$addToSet:{interest:{$each:newInterset}}})
	```

- $pop 删除数组值

	- $pop只删除一次，并不是删除所有数组中的值。而且它有两个选项，一个是1和-1。

	```
	1：从数组末端进行删除
	-1：从数组开端进行删除
	```

	- 例子：现在要删除xiaoWang的编码爱好（code）。

	```
	db.workmate.update({name:'xiaoWang'},{$pop:{interest:1}})
	```


	- 数组定位修改
		- 有时候只知道修改数组的第几位，但并不知道是什么，这时候我们可以使用interest.int 的形式。

例子，比如我们现在要修改xiaoWang的第三个兴趣为编码（Code），注意这里的计数是从0开始的。
		```
		db.workmate.update({name:'xiaoWang'},{$set:{"interest.2":"Code"}})
		```
		

### 修改：状态返回与安全

- db.runCommand( ):
	
	```
	db.workmate.update({sex:1},{$set:{money:1000}},false,true)
	var resultMessage=db.runCommand({getLastError:1})
	printjson(resultMessage);
	```
	- 上边的代码，我们修改了所有男士的数据，每个人增加了1000元钱(money)，然后用db.runCommand()执行，可以看到执行结果在控制台返回了。
	```
	{
        "connectionId" : 1,
        "updatedExisting" : true,
        "n" : 2,
        "syncMillis" : 0,
        "writtenTo" : null,
        "err" : null,
        "ok" : 1
	}
	```
	- false：第一句末尾的false是upsert的简写，代表没有此条数据时不增加;
	- true：true是multi的简写，代表修改所有，这两个我们在前边课程已经学过。
	- getLastError:1 :表示返回功能错误，这里的参数很多，如果有兴趣请自行查找学习，这里不作过多介绍。
	- printjson：表示以json对象的格式输出到控制台。

- findAndModify:
	- 从名字上就可以看出，findAndModify是查找并修改的意思。配置它可以在修改后给我们返回修改的结果。我们先看下面的代码：

	```
	var myModify={
    findAndModify:"workmate",
    query:{name:'JSPang'},
    update:{$set:{age:18}},
	    new:true    //更新完成，需要查看结果，如果为false不进行查看结果
	}
	var ResultMessage=db.runCommand(myModify);
	 
	printjson(ResultMessage)

	```
	
	- query：需要查询的条件/文档
	- sort:    进行排序
	- remove：[boolean]是否删除查找到的文档，值填写true，可以删除。
	- new:[boolean]返回更新前的文档还是更新后的文档。
	- fields：需要返回的字段
	- upsert：没有这个值是否增加。

### 查询：find的不等修饰符

- 简单查找：

```
db.workmate.find({"skill.skillOne":"HTML+CSS"})
```

- 筛选字段
	- 现在返回来的数据项太多，太乱，有时候我们的程序并不需要这么多选项。比如我们只需要姓名和技能就可以了。这时候我们需要写第二个参数，看下面的代码。 

	```
	db.workmate.find(
    {"skill.skillOne":"HTML+CSS"},
    {name:true,"skill.skillOne":true}
	)
	```
	- 细心的小伙伴会发现还不够完美，多了一个ID字段，这个也不是我们想要的，这时候只要把_id:false就可以了。当然这里的false和true，也可以用0和1表示。

	```
	b.workmate.find(
    {"skill.skillOne":"HTML+CSS"},
    {name:true,"skill.skillOne":true,_id:false}
	)
	```

- 不等修饰符

	- 小于($lt):英文全称less-than
	- 小于等于($lte)：英文全称less-than-equal
	- 大于($gt):英文全称greater-than
	- 大于等于($gte):英文全称greater-than-equal
	- 不等于($ne):英文全称not-equal

	- 我们现在要查找一下，公司内年龄小于30大于25岁的人员

	```
	db.workmate.find(
	    {age:{$lte:30,$gte:25}},
	    {name:true,age:true,"skill.skillOne":true,_id:false}
	)
	```

- 日期查找
	- MongoDB也提供了方便的日期查找方法，现在我们要查找注册日期大于2018年1月10日的数据，我们可以这样写代码

	```
	var startDate= new Date('01/01/2018');
	db.workmate.find(
	    {regeditTime:{$gt:startDate}},
	    {name:true,age:true,"skill.skillOne":true,_id:false}
	)
	```

### 查询：find的多条件查询

- $in修饰符
	- in修饰符可以轻松解决一键多值的查询情况。就如上面我们讲的例子，现在要查询同事中年龄是25岁和33岁的信息。

```
db.workmate.find({age:{$in:[25,33]}},
    {name:1,"skill.skillOne":1,age:1,_id:0}
)
```

- $or修饰符
	- 它用来查询多个键值的情况，就比如查询同事中大于30岁或者会做PHP的信息。主要区别是两个Key值。$in修饰符是一个Key值，这个需要去比较记忆。

	```
	db.workmate.find({$or:[
	    {age:{$gte:30}},
	    {"skill.skillThree":'PHP'}
	]},
	    {name:1,"skill.skillThree":1,age:1,_id:0}
	)	
	```

- $and修饰符
	- $and用来查找几个key值都满足的情况，比如要查询同事中大于30岁并且会做PHP的信息，这时需要注意的是这两项必须全部满足。当然写法还是比较简单的。只要把上面代码中的or换成and就可以了。
	
	```
	db.workmate.find({$and:[
	    {age:{$gte:30}},
	    {"skill.skillThree":'PHP'}
	]},
	    {name:1,"skill.skillThree":1,age:1,_id:0}
	)
	```

- $not修饰符
	- 它用来查询除条件之外的值，比如我们现在要查找除年龄大于20岁，小于30岁的人员信息。需要注意的是$not修饰符不能应用在条件语句中，只能在外边进行查询使用。

	```
	db.workmate.find({
	    age:{
	        $not:{
	            $lte:30,
	            $gte:20
	        }
	    }
	},
	{name:1,"skill.skillOne":1,age:1,_id:0}
	)
	```











